import React from 'react'
import Form from 'react-bootstrap/Form'
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import './editRental.css';
import { useNavigate,useSearchParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';


function EditRental(){
    const [searchParams, setSearchParams] = useSearchParams();
    const [startDate, setStartDate] = React.useState(new Date());
    const [endDate, setEndDate] = React.useState(new Date());
    const param = searchParams.get("rentalID");
    const navigate = useNavigate();
    const [rentalInfo, setRentalInfo] = React.useState([]);
    const [products, setProducts] = React.useState([]);
    const [productsIndDates, setProductsIndDates] = React.useState([]);
    const [Dates,setDates] = React.useState([]);
    const [changedInfo,changeC] = React.useState({});
    const [selectedOption, setSelectedOption] = React.useState('Select Product');
    const [error, setError] = React.useState(false);
    const [calcPrice, setCalcPrice] = React.useState({prod: 0, rntl: 0, discounted: 0});
    const auth_token = sessionStorage.getItem("auth")

    // Retrieve dates of unavailability ranges
    const onSelectDate = (dates) => {
        const [start, end] = dates; 
        console.log('selected dates')
        console.log(dates)
        setError(false);
        var valid = true
        Dates[selectedOption].forEach(element => {
            if(element >= start && element <= end){
                setError(true);
                valid = false
            }
        })
        // Calculate new price
        if (valid && end != null) {
            updatePrice({startDate: start, endDate: end})
        }
        setStartDate(start);
        setEndDate(end);
    };

    // Retrieve Rental document and products, set the states
    React.useEffect(() => {
    axios.get("http://localhost:8000/API/rental/"+ param, {headers: {auth: auth_token}})
        .then(
        res => {
            var rental = res.data.rental
            setRentalInfo(rental);
            
            axios.get("http://localhost:8000/API/inventory/many/" + rental.products_id.toString())
                .then(
                    res => {
                        var products = res.data.products
                        setProducts(products)
                        var unavailability_dates = [] // days between ranges of unaivalability dates 
                        var products_ind_dates = []
                        products.forEach(prod => {
                            products_ind_dates.push(prod.indisponibilityDates)
                            unavailability_dates.push(getDates(prod.indisponibilityDates))
                        })
                        console.log('unavailability_dates')
                        console.log(unavailability_dates)
                        setProductsIndDates(products_ind_dates)
                        setDates(unavailability_dates)
                        setCalcPrice({discounted: rental.price})
                    }
                )
        },
        (error) => {
            console.log(error);
        }
        )
    }, [])

    // Submit report
    const submitReport = async e => {
        e.preventDefault();
        console.log(changedInfo);
        // return $.ajax({
        //   url: "http://localhost:8000/API/rental/" + rentalInfo._id,
        //   type: "PATCH",
        //   body: JSON.stringify(rentalInfo),
        //   beforeSend: xhr => {
        //     xhr.setRequestHeader('auth', auth_token)
        //   },
        //   success: res => console.log(res),
        //   error: err => console.log(err)
        // });
    }

    // Submit data to edit in the rental document (and in the edited product for unavailability dates)
    const submitChanges = async e => {
        console.log('SUBMIT')
        e.preventDefault();
        if (document.getElementsByClassName("errorMSG").length || selectedOption === 'Select Product') {console.log('volevi');return;}
        var range = {startDate: new Date(startDate), endDate: new Date(endDate)}
        
        /***** RENTAL UPDATE *******/

        // Replacing the indexed prod date and update
        console.log(productsIndDates)
        var newDatesProds = productsIndDates
        newDatesProds[selectedOption] = range
        console.log(newDatesProds)

        // Update rental document with edited indisponibility date, discounted price and real price
        axios.patch("http://localhost:8000/API/rental/" + rentalInfo._id, 
            {datesProducts: newDatesProds, price: calcPrice.discounted, real_price: calcPrice.rntl}, 
            {headers: {auth: auth_token}})
            .then(
                res => console.log(res)
            )

        /***** INVENTORY UPDATE *******/
        
        var prodIndDatesArr = []
        if (typeof productsIndDates[selectedOption] === 'object' && productsIndDates[selectedOption] !== null)
        prodIndDatesArr = [productsIndDates[selectedOption]]
        else
            prodIndDatesArr = productsIndDates[selectedOption]
        console.log(prodIndDatesArr)
        var replacePos = null
        prodIndDatesArr.some((date, i) => {
            var prevStartDate = new Date(rentalInfo.datesProducts[selectedOption].startDate) // Previous start date in order to check which db date to replace
            console.log(prevStartDate)
            var startIndDate = new Date(date.startDate)
            console.log(startIndDate)
            startIndDate.setHours(startIndDate.getHours()) // So that the conversion to UTC doesn't add 2 hours and get the next day instead
            startIndDate.setHours(0, 0, 0, 0)
            prevStartDate.setHours(0, 0, 0, 0)
            console.log(startIndDate)
            console.log(prevStartDate)
            if (startIndDate.getTime() == prevStartDate.getTime()) {
                replacePos = i
                console.log(replacePos)
                return true;
            }
        })

        range.startDate.setHours(5) // So that the conversion to UTC doesn't substract 2 hours and get the previous day instead
        if (replacePos != null)
            prodIndDatesArr[replacePos] = range
        // toUpdateObject['indisponibilityDates'] = prodIndDatesArr

        // Update product document with edited indisponibility date
        axios.patch("http://localhost:8000/API/inventory/" + products[selectedOption]._id, 
            {indisponibilityDates: prodIndDatesArr}, 
            {headers: {auth: auth_token}})
            .then(
                res => console.log(res)
            )
    }

    // Calculate array of days between the ranges of unavailable dates
    const getDates = (startDate) => {
        // console.log(startDate)
        const dates = []
        var endDate
        const invDates = startDate;
          const addDays = function (days) {
            const date = new Date(this.valueOf())
            date.setDate(date.getDate() + days)
            return date
          }
        invDates.forEach(element => {
          startDate = new Date(element.startDate)
          var currentDate = startDate
          endDate = new Date(element.endDate)
          while (currentDate <= endDate) {
            dates.push(currentDate)
            currentDate = addDays.call(currentDate, 1)
          }
        });
        return dates;
    }

    // Calc Price end edit db documents
    const calculatePrice = async (total_price, products_prices, products_mult_prices, products_dates) => {
        var discounted_price = total_price
        var singleProduct = selectedOption
        var singleProductPrice = products_mult_prices[singleProduct]
        
        // Applying Promotions
        await axios.get("API/promotions/", {headers: {auth: auth_token}})
            .then(
                res => {
                    var proms = res.data.promotions
                    for (const [key, value] of Object.entries(proms)) {
                        var prom_start_date = new Date(value.start_date)
                        var prom_end_date = new Date(value.end_date)
                
                        products_dates.forEach((d, i) => {
                            // If the order was placed within the promotion period
                            if (d.startDate >= prom_start_date && d.startDate <= prom_end_date) {
                                discounted_price -= (products_mult_prices[i] / 100) * value.percentage
                                
                                if (i == singleProduct)
                                    singleProductPrice -= (products_mult_prices[singleProduct] / 100) * value.percentage
                            }
                        })
                    }
                    // console.log('proms done inner')
                }
            )
            // console.log('proms done')
      
        // Weekdays Discount - Use Case 1
        // console.log(products_dates)
        products_dates.forEach((d, index) => {
          var start_day = new Date(d.startDate).getDay() // Sunday = 0, Monday = 1, ...
          var diffInDays = products_mult_prices[index] / products_prices[index]
          var current_day = start_day
          var inner_weekdays = false
        // console.log(diffInDays)
          for(var i=0; i < diffInDays; i++) {
            // Start weekdays check
            // console.log(current_day)
            if(current_day == 0) {
              inner_weekdays = true;
            }
            // console.log(inner_weekdays)
      
            // Inner weekdays Confirmed
            if(current_day == 4 && inner_weekdays) {
                // console.log('weekdays discount')
              var sub_amount = products_prices[index] + products_prices[index] * 0.5 + products_prices[index] * 0.25 // For free on Mondays, 50% on Tuesdays, 25% on Wednesdays 
              discounted_price -= sub_amount
              if (index == singleProduct)
                singleProductPrice -= sub_amount
              inner_weekdays = false;
            }
            
            if (current_day == 6) current_day = 0
            else current_day++
          }
        })
      
        return {total: discounted_price, single: singleProductPrice}
      }
      
    const updatePrice = async (productDates) => {
        axios.get("API/rental/" + rentalInfo._id, {headers: {auth: auth_token}})
            .then(
                res => {
                    var rental = res.data.rental
                    axios.get("API/inventory/many/" + rental.products_id.toString())
                        .then(
                            async res => {
                                var prods = res.data.products

                                var newDatesProds = rental.datesProducts
                                newDatesProds[selectedOption] = productDates
                                // toUpdateObject['datesProducts'] = newDatesProds

                                var prices = []
                                var multPrices = []
                                var prodsSumPrice = 0
                                prods.forEach((prod, i) => {
                                    // const diffInMs   = toCreateObject['datesProducts'][i].endDate.getTime() - toCreateObject['datesProducts'][i].startDate.getTime()
                                    // console.log(newDatesProds)
                                    const diffInMs   = (new Date(newDatesProds[i].endDate)).getTime() - (new Date(newDatesProds[i].startDate)).getTime()
                                    const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24)) + 1;
                                    const multPrice = prod.price * diffInDays
                                    prodsSumPrice += multPrice // Sum of products to multiply for rental days
                                    multPrices.push(multPrice)
                                    prices.push(prod.price)
                                })
                        
                                const rentalPrice = prodsSumPrice
                                // console.log("Calculating price...")
                                var updatedPrices = await calculatePrice(rentalPrice, prices, multPrices, newDatesProds)  
                                // console.log('updated price inner: {single: ' + updatedPrices.single + ', total: ' + updatedPrices.total)

                                setCalcPrice({prod: updatedPrices.single, rntl: rentalPrice, discounted: updatedPrices.total})
                            }
                        )
                }
            )
    }

    const setInitialDates = async (prodIndex) => {
        // console.log(rentalInfo.datesProducts[prodIndex].startDate)
        var start = new Date(rentalInfo.datesProducts[prodIndex].startDate)
        var end = new Date(rentalInfo.datesProducts[prodIndex].endDate)
        setStartDate(start)
        setEndDate(end)
        // onSelectDate([start, end])
    }

    return (
        <div className="infoSection">
            <Link to="/privateArea">
                <FontAwesomeIcon className="backIcon" icon={faArrowLeft} size="2x"/>
            </Link>
            <div className="formFields container">
                <Form className="Infos-form">
                    <Form.Text>
                        <div className="titleFormC">
                            <h1 className="changeinfos-title">Edit a Product's Dates</h1>
                        </div>
                    </Form.Text>
                    <div className="firstSectionC">
                        <Form.Select aria-label="Select Product" size="lg" value={selectedOption} className="selectProd" onChange={e => {setInitialDates(e.target.value);setSelectedOption(e.target.value)}}>
                            <option>Select Product</option>
                            {products.map((prod, i) => (
                                <option value={i}>{prod.name}</option>
                            ))}
                        </Form.Select>
                        <div className='edit-product-wrapper'>
                            {selectedOption != "Select Product"  &&
                            <>
                                <img className="productsImg" src={'img/products/'+ products[selectedOption].image}/>
                                <div className='calendar'>
                                    <DatePicker
                                        wrapperClassName="date-picker"
                                        selected={startDate}
                                        startDate={startDate}
                                        endDate={endDate}
                                        excludeDates={Dates[selectedOption]}
                                        selectsRange
                                        selectsDisabledDaysInRange
                                        inline
                                        onChange={onSelectDate}
                                    />
                                    {error && <p className='errorMSG'>The range includes unavailable dates!</p>}
                                </div>
                                <div>
                                    <h2 className="reportTitle">Report an Issue</h2>
                                    <FloatingLabel controlId="floatingTextarea2" label="Describe the issue">
                                        <Form.Control
                                        as="textarea"
                                        placeholder="The product doesn't work..."
                                        />
                                    </FloatingLabel>
                                    <Button type = 'submit' className="btn-broken" onClick={submitReport}>
                                        Report
                                    </Button>
                                </div>                
                                <div className='pricesDiv'>
                                    <p className='parRentalPrice'>Rental Price: {calcPrice.discounted}$</p>
                                    <p className='parProdPrice'>Product Price (per day): {products[selectedOption].price}$</p>
                                    <p>New Product Price: {calcPrice.prod}$</p>
                                </div>       
                            </>
                            }
                        </div>
                        <Button type = 'submit' className="btnFormC" onClick={submitChanges}>
                            Edit Rental
                        </Button>
                    </div>
                    
                </Form>
            </div>
        </div>
    );
}

export default EditRental;