import moment from 'moment';
import axios from 'axios';

async function calculateChartData(rental, range, config, col) {
    console.log(config.fieldToCountOn)
    var conditions = []
    const CONDITIONS = [
        'New',
        'Perfect',
        'Good',
        'Broken'
      ];

    if(config.fieldToCountOn !== "Conditions") {
        console.log('ao?')
        /* Initialization first sub range (month) */
        var start_date = range[0]
        var end_date = new Date(range[0].getFullYear(), start_date.getMonth() + 1, 0); // This way you get the last day of the previous month
        var counter = []
        var months = []
        var start_m = moment(start_date)
        var end_m = moment(end_date)
        const MONTHS = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ];

        var incoming, filteredByValue;

        /* The range is smaller than one month */
        if (end_date > range[1]) return rental.length 

        /* Count how many records per month within the given range */
        do {
        incoming = 0;
        if (config.colToCount === 'products') {
            filteredByValue = Object.fromEntries(
            Object.entries(rental).filter(([key, value]) => new Date(value.creation_date) >= start_date && new Date(value.creation_date) <= end_date ) )
        } else {
            filteredByValue = Object.fromEntries(
            Object.entries(rental).filter(([key, value]) => new Date(value.start_date) >= start_date && new Date(value.start_date) <= end_date ) )
        }
        console.log('filteredByValue')
        // console.log(filteredByValue)

        if(config.fieldToCountOn === "Incoming"){
            if (col === 'inventory') {

                // Calculates incoming based on pricesProducts
                const IncomeOption = Object.keys(filteredByValue).map((x, i) => {
                    console.log(filteredByValue[x])
                filteredByValue[x].price != undefined ? incoming+=filteredByValue[x].pricesProducts[i].price : console.log(filteredByValue[x].price);
                }) 

            } else {

                // Calculates generated income based on rentals' price
                for (const [key, rental] of Object.entries(filteredByValue)) {
                    incoming += rental.price
                }

            }
            
            console.log(incoming);
            counter.push(incoming);
        }
        else{
            // Standard counting by number of rental per month
            counter.push(Object.keys(filteredByValue).length) 
        }
        
        months.push(MONTHS[start_date.getMonth()])

        /* Month Range Update */
        start_date = start_m.add(1, 'month').toDate()
        end_date   = end_m.add(1, 'month').toDate()
        if (end_date > range[1]) end_date = range[1]
        } while (start_date < range[1])

        return {data: counter, labels: months} 

    } else {
    
        await axios.get("/api/inventory/")
        .then((res) => {
            var inventoryP = res.data.products
            console.log(inventoryP)
            var stateNew=0;
            var statePerfect=0;
            var stateGood=0;
            var stateBroken=0;
            inventoryP.forEach(element => {
              switch(element.state){
                case "new":{
                  stateNew ++;
                  break;
                };
                case "perfect":{
                  statePerfect++;
                  break;
                };
                case "good":{
                  stateGood++;
                  break;
                };
                case "broken":{
                  stateBroken++;
                  break;
                };
                default:{
                  break;
                }
              }
            });
            conditions = [stateNew, statePerfect, stateGood, stateBroken]
            console.log(conditions)
          })    
          .catch((errors) => {
              console.log(errors);
          })
          console.log('primo')
          return {data: conditions, labels: CONDITIONS}

    }
    
}

export {calculateChartData}