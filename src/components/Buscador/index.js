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
      hasMore: true, //hasmore es una propiedad dentro de la función fetchMoreData. Es un boolean que dice si hay más items para cargar o si no los hay.
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
  
  //En fecthMoreData, se cargan más datos cada vez que se llegan a visualizar los cincuenta resultados mostrados.
  fetchMoreData = () => {
  
    //Si hay items para mostrar (si la cantidad de publicaciones del vendedor es diferente de cero), se crea un contador llamado aux, que le suma '50' al valor actual del offset cada vez que llega al final de página. El offset es el parámetro que tiene MercadoLibre para determinar desde dónde empezar a mostrar los productos. Si yo pongo un offset de valor "0", se muestran los primeros cincuenta productos (0-49). Si yo pongo un offset "50", se podrán ver los segundos cincuenta productos (50-99). Se repite sucesivamente de esta forma, hasta que se alcanza el límite de productos encontrados para ese vendedor.
   if (this.state.items.length !== 0) {
     var aux = parseInt(localStorage.getItem('offset')) + 50;
     parseInt(localStorage.setItem('offset', aux));
   }
   
    
    //Busca los resultados en localhost que coincidan con los resultados de búsqueda del usuario.
    axios.get('http://localhost:4000/items/searchItems/' + localStorage.getItem('seller') + "&offset=" + parseInt(aux))
    .then(res => {
      
      
      this.setState({ items: this.state.items.concat(Array.from(res.data)) , userok: 'true'}); //Guarda un array de caracteres extraido de "res.data", los concatena y los guarda en "items". Esto lo hace para que el programa sepa de dónde sacar las publicaciones del vendedor.
      //console.log(aux);
      //console.log(res.data);
      //console.log("HOLA");
      //console.log(localStorage.getItem('offset'))
      //console.log(this.state.items.concat(Array.from(res.data)))
    })
    
    
    //Si la cantidad de items es mayor o igual a "cantidadDeResultadosTotales" (esta variable guarda la cantidad de publicaciones totales del vendedor), setState se pone en falso, porque no hay más resultados que mostrar.
    if (this.state.items.length >= localStorage.getItem ('cantidadDeResultadosTotales')) {
      this.setState({ hasMore: false });
      return;
    }
    // a fake async api call like which sends
    // 20 more records in .5 secs
    
    
    
    //Muestra los items obtenidos anteriormente
      this.setState({
       items:  []
      }); 
      
    
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
          
          //El componente en HTML
          <InfiniteScroll
          dataLength={this.state.items.length}
          next={this.fetchMoreData}
          hasMore={this.state.hasMore}
          loader={<h4>Cargando...</h4>}
          endMessage={
            <p style={{ textAlign: "center" }}>
              <b>Llegaste al final de página</b>
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
