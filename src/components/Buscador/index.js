// Dependencies
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import 'react-light-accordion/demo/css/index.css';
import "bootstrap";
import InfiniteScroll from "react-infinite-scroll-component";
import { Card, CardImg, Button, Popover, PopoverHeader, PopoverBody } from 'reactstrap';
import Alert from 'react-bootstrap/Alert';
import Cookies  from 'universal-cookie'; 

var cookie = new Cookies;


function startFollowing(item, token) {

  console.log(item);
  item = JSON.stringify(item);
  axios.post('http://localhost:4000/items/startFollowing', { item, token })
    .then(function (data) {
      //this.props.history.push('/FollowingItems');
    });

}

function isEmptyObject(obj) {
  return !Object.keys(obj).length;
}

const Item = props => (
  <tr>
    <td>      
      <a href={props.item.Link}>Ver</a>
    </td>
    <td >{props.item.Nombre}</td>
    <td>
      <Link to="/buscador">
        <span onClick={() => startFollowing(props.item, JSON.stringify(cookie.get("cookieQueGuardaElToken")))}>${props.item.Precio}</span>
      </Link>
    </td>
  </tr>
)


class Buscador extends Component {

  constructor(props) {
    super(props);
    this.toggle = this.toggle.bind(this);
    this.state = {

      render: true,
      text: '',
      items: [],
      popoverOpen: false,
      hasMore: true,
      first: false,
      userok: ''

    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }



  toggle() {
    this.setState({
      popoverOpen: !this.state.popoverOpen
    });
  }

  componentDidMount() {
    axios.get('http://localhost:4000/items/searchItems/' + localStorage.getItem('seller') + "&offset=" + localStorage.getItem('offset')) 
    
    //console.log(res.total)
    .then(res => {
    
      if (!isEmptyObject(res.data)) this.setState({ items: res.data, userok: 'true'}); 
      console.log(res.data)
      
    })
    .catch(function (err) {
      console.log(err);
    })
    if(!this.state.first) this.setState({userok: 'false'}); else this.setState({first: false});
      
      
      
    //axios.get('https://api.mercadolibre.com/sites/MLA/search?nickname=' + localStorage.getItem('seller'))
    //.then(res => {
    //  
    //  cantidadDeResultadosTotales = res.data.paging.total;
    //  
    //}) 
    
  }

  itemList() {

    return this.state.items.map(function (citem, i) {
      return <Item item={citem} key={i} />;
      
    })

  }
  fetchMoreData = () => {
  
   if (this.state.items.length !== 0) {
     var aux = parseInt(localStorage.getItem('offset')) + 50;
     parseInt(localStorage.setItem('offset', aux));
   }
   
    axios.get('http://localhost:4000/items/searchItems/' + localStorage.getItem('seller') + "&offset=" + parseInt(aux))
    .then(res => {
      
      
      this.setState({ items: this.state.items.concat(Array.from(res.data)) , userok: 'true'});
      console.log(aux);
      console.log(res.data);
      console.log("HOLA");
      console.log(localStorage.getItem('offset'))
      console.log(this.state.items.concat(Array.from(res.data)))
    })
    
    
    
    if (this.state.items.length >= localStorage.getItem ('cantidadDeResultadosTotales')) {
      this.setState({ hasMore: false });
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    
      this.setState({
       items:  []
      }); 
      
      

      // offset = offset + 50
    
  };
  render() {
    
    var alerta;
    if (this.state.userok === ''){
      alerta = <div className = "puntitos">...</div>
    }else if(this.state.userok === 'false') {
      alerta = <Alert variant='warning'>NO HAY UN USUARIO CON ESE NOMBRE!</Alert>
    }else{
      alerta = <Alert variant='success'>USUARIO ENCONTRADO CORRECTAMENTE</Alert>
    }
    return (

      <div className="Buscador">

        <div align = "center" >

          <form onSubmit={this.handleSubmit}>
            
            <label htmlFor="new-todo">
              Usuarios:
            </label>
            <input
              id="new-todo"
              onChange={this.handleChange}
              value={this.state.text}
            />
            <button>
              Buscar
            </button>
            <Button id="Popover1" type="button">¿?</Button>
            <Popover placement="bottom" isOpen={this.state.popoverOpen} target="Popover1" toggle={this.toggle}>
              <PopoverHeader>¿Cómo buscar tiendas oficiales?</PopoverHeader>
              <Card>
                  <CardImg top width="100%" src ="https://i.imgur.com/H3pRjHy.gif" alt="Carrrrs" />
            </Card>
              <PopoverBody><div class="media-body"><p></p><p>1. En la página del producto, diríjase hasta encontrar la información de la tienda. Cliquee en "Ver más datos de (Nombre de la tienda)". </p> <p> 2. Introduzca el nombre de la tienda que figura en la URL de la página (remarcado en celeste) dentro del cuadro de búsqueda.</p> </div></PopoverBody>
            </Popover>
            
          </form>

        </div>
        <div>
          {alerta}
        </div>
        <p style={{color:"#7c7d7e",backgroundColor:"#ebebeb"}}>&nbsp;Productos de usuarios por busqueda.&nbsp;</p>
        <table className="table" style={{ marginTop: 20 }}>

          <thead>

            <tr>

              <th>Publicacion</th>
              <th>Nombre</th>
              <th>Seguir</th>

            </tr>

          </thead>
          <tbody>
          <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Loading...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Yay! You have seen it all</b>
            </p>
          }
          >
          
          
          
          
        </InfiniteScroll>

        {this.itemList()}
        
          </tbody>

        </table>

      </div>

    );

  }

  onClick(e) {
    e.preventDefault();
  }

  handleChange(e) {
    this.setState({ text: e.target.value });
  }

  handleSubmit(e) {

    e.preventDefault();
    if (!this.state.text.length) {
      return;
    }
    var username = this.state.text;
    localStorage.setItem('seller', username)
    parseInt(localStorage.setItem('offset', 0))
    localStorage.setItem ('cantidadDeResultadosTotales', 150)
    /*axios.get('http://localhost:4000/items/searchItems/' + username)
      .then(setTimeout(function () {*/
        window.location.reload()
      //}.bind(this), 1000));

  }

  handleFollow() {

    if (!this.state.text.length) {
      return;
    }
    axios.post('http://localhost:4000/MLfollowing/add', { _name: this.state.text })
      .then(function () { window.location.reload(); });

  }

}

export default Buscador;
