class MobileMenu extends React.Component {
  state = { isOpen: false }

  toggle = () => this.setState({ isOpen: !this.state.isOpen })

  render() {
    return (
      <div className="mobile-wrapper">
        <div className="mobile-menu">
          <Reactstrap.Container className="pos-ref">
            <i
              className="fas fa-times mobile-menu__close-bt"
              onClick={this.props.hideNav}
            />
          </Reactstrap.Container>
        </div>
        <Reactstrap.Nav vertical className={'mobile-nav'}>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>home</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>about</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>features</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>screenshots</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>team</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>pricing</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem>
            <Reactstrap.Dropdown isOpen={this.state.isOpen} toggle={this.toggle}>
              <Reactstrap.DropdownToggle className="drop-item" caret>
                Dropdown
              </Reactstrap.DropdownToggle>
              <Reactstrap.DropdownMenu className="drop-menu">
                <Reactstrap.DropdownItem>dropdown-1</Reactstrap.DropdownItem>
                <Reactstrap.DropdownItem>dropdown-2</Reactstrap.DropdownItem>
                <Reactstrap.DropdownItem>dropdown-3</Reactstrap.DropdownItem>
                <Reactstrap.DropdownItem>dropdown-4</Reactstrap.DropdownItem>
              </Reactstrap.DropdownMenu>
            </Reactstrap.Dropdown>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>blog</Reactstrap.NavLink>
          </Reactstrap.NavItem>
          <Reactstrap.NavItem className="nav-item-m">
            <Reactstrap.NavLink>contact</Reactstrap.NavLink>
          </Reactstrap.NavItem>
        </Reactstrap.Nav>

      </div>
    )
  }
}

export default class MobileMenu extends Component {
  dropNav = React.createRef()

  hamButton = React.createRef()

  over = () => {
    this.dropNav.current.style.display = 'block'
    this.opacityTiemOut = setTimeout(() => {
      this.dropNav.current.style.opacity = '1'
    })
  }
  out = () => {
    this.dropNav.current.style.transition = 'all .5s 1s'
    this.dropNav.current.style.opacity = '0'
  }
  onHide = () => {
    if (this.dropNav.current.style.opacity === '1') return
    this.dropNav.current.style.display = 'none'
    this.dropNav.current.style.transition = 'all .5s'
  }

  hideNav = e => {
    document.body.style.overflow = 'visible'
    this.mobileMenu.style.display = 'none'
    this.hamButton.style.display = ''
    this.mobileNav.style.transform = `translateX(-100%)`
  }

  showNav = e => {
    e.preventDefault()
    document.body.style.overflow = 'hidden'
    this.hamButton.style.display = 'none'
    this.menuWrapper.style.display = 'block'
    this.mobileMenu.style.display = 'block'
    setTimeout(() => {
      this.mobileNav.style.transform = 'translateX(0px)'
    }, 200)
  }
  fixedNav() {
    const nav = document.querySelector('.navi-menu')
    const navHeigth = parseInt(window.getComputedStyle(nav).height, 10)
    const scrollEl = document.scrollingElement
    if (scrollEl.scrollTop > navHeigth) {
      nav.style.position = 'fixed'
      nav.classList.add('scroll-nav')
    } else {
      nav.style.position = 'static'
      nav.classList.remove('scroll-nav')
    }
  }
  componentDidMount() {
    window.addEventListener('scroll', this.fixedNav)
    this.menuWrapper = document.querySelector('.mobile-wrapper')
    this.mobileMenu = document.querySelector('.mobile-menu')
    this.mobileNav = document.querySelector('.mobile-nav')
    this.hamButton = document.querySelector('.ham')
  }
  componentWillUnmount() {
    window.removeEventListener('scroll', this.fixedNav)
  }
  render() {
    return (
      <div className="navi-menu">
        <Reactstrap.Container>
          <Reactstrap.MobileMenu hideNav={this.hideNav} />

          <Reactstrap.Nav className="nav-n">
            <Reactstrap.NavItem className="nav-item-n logo">
              <Reactstrap.NavLink href="#">eStarup</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n ham" onClick={this.showNav}>
              <Reactstrap.NavLink href="">
                <i class="fas fa-bars" />
              </Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">home</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">about</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">features</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">screenshots</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">team</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">pricing</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <div
              className="drop"
              onMouseOver={this.over}
              onMouseOut={this.out}
              onTransitionEnd={this.onHide}
            >
              <Reactstrap.NavItem>
                <Reactstrap.NavLink href="#" className="nav-item-n caret">
                  dropdown
              </Reactstrap.NavLink>
              </Reactstrap.NavItem>
              <div className="drop__item" ref={this.dropNav}>
                <Reactstrap.Nav vertical>
                  <Reactstrap.NavItem className="nav-item-n">
                    <Reactstrap.NavLink href="#">dropdown-1</Reactstrap.NavLink>
                  </Reactstrap.NavItem>
                  <Reactstrap.NavItem className="nav-item-n">
                    <Reactstrap.NavLink href="#">dropdown-2</Reactstrap.NavLink>
                  </Reactstrap.NavItem>
                  <Reactstrap.NavItem className="nav-item-n">
                    <Reactstrap.NavLink href="#">dropdown-3</Reactstrap.NavLink>
                  </Reactstrap.NavItem>
                  <Reactstrap.NavItem className="nav-item-n">
                    <Reactstrap.NavLink href="#">dropdown-4</Reactstrap.NavLink>
                  </Reactstrap.NavItem>
                </Reactstrap.Nav>
              </div>
            </div>

            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">Blog</Reactstrap.NavLink>
            </Reactstrap.NavItem>
            <Reactstrap.NavItem className="nav-item-n">
              <Reactstrap.NavLink href="#">Contact</Reactstrap.NavLink>
            </Reactstrap.NavItem>
          </Reactstrap.Nav>
        </Reactstrap.Container>
      </div>
    )
  }
}


/*
<style jsx>{`
  .scroll-nav {
    background: white;
    width: 100%;
    z-index: 4;
    box-shadow: #e1dfdf 1px 1px 11px;
  }
  .nav-n {
    align-items: center;
  }
  .nav-item-n {
    display: none;
    font-size: 14px;
  }
  .nav-item-n:not(.logo) {
    text-transform: capitalize;
  }
  .nav-item-n a {
    padding: 0.5rem 0.6rem;
    color: inherit;
  }
  .nav-item-n:not(.ham):not(.logo):hover {
    color: var(--brand-color);
  }
  .logo {
    font-family: 'Philosopher', sans-serif;
    font-size: 2em;
  }
  .logo:first-letter {
    color: var(--brand-color);
  }
  @media (min-width: 1024px) {
    .nav-item-n {
      display: block;
    }
  }
  .logo,
  .ham {
    display: block;
  }
  .ham {
    margin-left: auto;
    font-size: 1.4rem;
  }
  @media (min-width: 1024px) {
    .ham {
      display: none;
    }
    .logo {
      margin-right: auto;
    }
  }

  .drop {
    position: relative;
  }
  .drop__item {
    position: absolute;
    display: none;
    transition: all 0.5s;
    width: 200px;
    padding: 0.5rem 0;
    opacity: 0;
    box-shadow: 0px 0px 20px 0px #f1f1f1d1, 0px 0px 20px 0px #ffffff2b;
    z-index: 3;
  }
  .drop__item .nav {
    align-items: flex-start;
  }
  .drop__item a {
    padding: 0.65rem 1.3rem;
  }
  .caret:after {
    content: '';
    display: inline-block;
    vertical-align: middle;
    margin-left: 5px;
    width: 5px;
    height: 5px;
    border: none;
    border-left: 2px solid;
    border-bottom: 2px solid;
    transform: rotate(-45deg);
  }
`}</style>
*/

/*
const Link = ReactRouterDOM.Link;
const Route = ReactRouterDOM.Route;

const App = () => (
  <ReactRouterDOM.HashRouter>

      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/login">Login</Link></li>
        <li><Link to="/register">Register</Link></li>
      </ul>

    <Route path="/" exact component={Home} />
    <Route path="/login" component={Login} />
    <Route path="/register" component={Register} />
  </ReactRouterDOM.HashRouter>
)

const Home = () => <h4>Home</h4>
const Login = () => <h1>Login</h1>
const Register = () => <h1>Register</h1>

ReactDOM.render(<App />, document.querySelector('#root'));*/
