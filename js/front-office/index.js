
/*require("Navigation.jsx");

ReactDOM.render(
    <Router>
      <Navigation />
      {/* <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/objects" element={<Blog />}>
          <Route path="" element={<Posts />} />
          <Route path=":objectSlug" element={<Post />} />
        </Route>
      </Routes>
      <Footer /> *//*}
    </Router>,

    document.getElementById("root")
);*/




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

ReactDOM.render(<App />, document.querySelector('#root'));
