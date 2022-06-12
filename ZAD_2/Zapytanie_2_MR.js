var mapFunction = function(){
    this.credit.forEach(c => {
        emit(c.currency, {
            balance: Number(c.balance)
            })
    })
    };
    
var reduceFunction = function(currency, currencyBalanceObject){
    var result = {balance:0}
    currencyBalanceObject.forEach(e => {
    result.balance+=e.balance;
    });
    return result;
    };
        
var finalizeFunction = function(currency, reducedValues) {
    var res = { balanceSum : reducedValues.balance}
    return res;
    }

 db.people.mapReduce(
    mapFunction,
    reduceFunction,
    {
    out: "map_reduce_2",
    finalize: finalizeFunction
    }
    )
    
printjson(db.map_reduce_2.find().sort( { _id: 1 } ).toArray())