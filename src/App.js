import React from "react";
import web3 from "./web3";
import lottery from "./lottery";

class App extends React.Component {

  state ={
    manager:'',
    players:[],
    balance:'',
    value:'',
    message:''
  }

  async componentDidMount(){
    const manager = await lottery.methods.manager().call();
    const players = await lottery.methods.getPlayers().call();
    const balance = await web3.eth.getBalance(lottery.options.address);
    this.setState({manager, players, balance})
  }

  onSubmit = async (event) =>{
    event.preventDefault();
    const accounts = await web3.eth.getAccounts();

    this.setState({message: "you've successfully invoked the transaction, Wait for transaction completion"})

    await lottery.methods.enter().send({
      from:accounts[0],
      value: web3.utils.toWei(this.state.value, 'ether')
    })

    this.setState({message: 'Congratulation!, Transaction Sucessfull'})

  }


  onClick = async () =>{
    const accounts = await web3.eth.getAccounts();

    this.setState({message: "Picking Winner"})

    await lottery.methods.pickWinner().send({
      from:accounts[0]
    });

    this.setState({message: "The Winner hs been picked"})

  }
  
  render() {
    return (
      <div>
        <h2>Lottery Contract</h2>
        <p>This contract is managed by {this.state.manager},<br></br>
         There are currenty {this.state.players.length} players are in the game<br></br>
         The total reward ammount is {web3.utils.fromWei(this.state.balance, 'ether')}
        </p>
        <hr/>
        <form onSubmit={this.onSubmit}>
          <h4>Want to try your luck?</h4>
          <div>
            <label>Enter the amount: </label>
            <input
              value={this.state.value}
              onChange={(event) => this.setState({ value: event.target.value })}
            />    
          </div>
          <button>Enter</button>
        </form>
        <hr/>
        <h4>Pick A Winner</h4>
        <button onClick= {this.onClick}>Enter</button>
        <hr/>
        <h1>{this.state.message}</h1>
        
      </div>
    );
  }
}
export default App;
