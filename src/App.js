import React from 'react';
import './App.css';
import axios from 'axios';

import { ReactComponent as Check } from "./icons/check.svg";
import { ReactComponent as Calendar } from "./icons/calendar.svg";
import { ReactComponent as Clock } from "./icons/clock.svg";
import { ReactComponent as Money } from "./icons/money.svg";
import { ReactComponent as Place } from "./icons/place.svg";

export default class App extends React.Component {
  constructor(props){
    super(props)
    this.state = {
      purchases: [],
      products: []
    }
  }

  componentDidMount() {
    let currentComponent = this;
    axios.get(`https://storage.googleapis.com/dito-questions/events.json`)
      .then(function (response) {
        const res = response.data.events

        currentComponent.setState({
          purchases: res.filter(name => name.event === "comprou"),
          products: res.filter(product => product.event === "comprou-produto")
        })
      })

      .catch(function (error) {
        console.log(error);
      })
  }

  render() {
    function formatDate(data) {
      var date = new Date(data);

      return date.toLocaleDateString()
    }

    function formatTime(data) {
      var date = new Date(data);

      return date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    }

    function formatMoney(value) {

      return value.toLocaleString(navigator.language, { minimumFractionDigits: 2 });
    }

    return (
      <div className="App">
        <ul className="timeline">
         {this.state.purchases.map((item) => (
            <li className="timeline-inverted" key={item.custom_data.find(data => data.key === 'transaction_id').value}>
              <div className="timeline-badge">
                <Check style={{width:30, height:30}} />
              </div>
              <div className="timeline-panel">
                <div className="timeline-heading">
                  <p className="timeline-title">
                    <span>
                      <Calendar style={{width:14, height:14}} />
                        {formatDate(item.timestamp)}
                    </span>
                    <span>
                      <Clock  style={{width:14, height:14}}/>
                        {formatTime(item.timestamp)}
                    </span>
                    <span>
                      <Place style={{width:14, height:14}}/>
                        {item.custom_data.find(data => data.key === 'store_name').value}
                    </span>
                    <span>
                      <Money style={{width:14, height:14}}/>
                        R$ {formatMoney(item.revenue)}
                    </span>
                  </p>
                </div>
                <div className="timeline-body">
                  <table className="table" frame="void" rules="rows">
                    <thead>
                      <tr className="active">
                        <th scope="col" width='80%'>Produto</th>
                        <th scope="col">Preço</th>
                      </tr>
                    </thead>
                    <tbody>
                      {this.state.products.map((product, index) =>(
                        ((item.custom_data.find(
                          data => data.key === 'transaction_id').value) === (
                            product.custom_data.find(
                              data => data.key === 'transaction_id').value)) &&
                          <tr className="active" key={index}>
                            <td>
                              {product.custom_data.find(
                                data => data.key === 'product_name').value}
                            </td>
                            <td>
                              {formatMoney(product.custom_data.find(
                                data => data.key === 'product_price').value)}
                            </td>
                          </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
