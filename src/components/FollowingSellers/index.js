import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Accordion, AccordionItem } from 'react-light-accordion';
import axios from 'axios';
import "bootstrap/dist/css/bootstrap.min.css";
import Cookies  from 'universal-cookie'; 
import 'react-light-accordion/demo/css/index.css';

var cookie = new Cookies;
var url = 'https://api.mercadolibre.com/sites/MLA/search?';

function isEmptyObject(obj){
  return !Object.keys(obj).length;
}

const Item = props => (

    <AccordionItem title={props.item._name}>

        <table className="table table-striped" style={{ marginTop: 20 }}>

            <thead>

                <tr>

                    <th>Producto</th>
                    <th>Campo</th>
                    <th>Valor Anterior</th>
                    <th>Valor Actual</th>

                </tr>

            </thead>  
            <tbody></tbody>

        </table>
            
    </AccordionItem>

)

class FollowingSellers extends Component {

    constructor(props) {
        super(props);
        this.state = {
    
          empty: true,
          items: [],
    
        };

    }
      
    componentDidMount(){    

        axios.get('https://pruebaenreact.azurewebsites.net/MLHuergo/FollSell/searchForMe')
            .then(res => {
                console.log(res.data);
                if(!isEmptyObject(res.data)) this.setState({ items: res.data });
            })
            .catch(function (err){
                console.log(err);
            })
        axios.post('https://pruebaenreact.azurewebsites.net/MLHuergo/items/delete')

    }

    itemList() {

        return this.state.items.map(function(citem, i){
            return <Item item={citem} key={i} />
        })
    
    }

    render(){
        
        return(

            <div className="FollowingSellers">
                
                <Accordion atomic={true}>
                    {this.itemList()}
                </Accordion>

            </div>

        );

    }

}

export default FollowingSellers;