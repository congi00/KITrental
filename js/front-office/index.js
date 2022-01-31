import "Navigation.jsx";

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
      <Footer /> */}
    </Router>,
  
    document.getElementById("root")
);