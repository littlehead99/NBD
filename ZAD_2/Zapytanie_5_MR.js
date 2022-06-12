var mapFunction = function(){
    if(this.nationality == "Poland" && this.sex == "Female")
    {
        this.credit.forEach(c => {
            emit(c.currency, {
                balance: Number(c.balance)
                })
        })
        };
    }
    
    
var reduceFunction = function(currency, currencyBalanceObject){
    var result = {count:0, sumBalance:0}
    currencyBalanceObject.forEach(e => {
        result.count++;
        result.sumBalance+=e.balance;
    });
    return result;
    };
        
var finalizeFunction = function(currency, reducedValues) {
    var res = { avgBalance : reducedValues.sumBalance / reducedValues.count,
        sumBalance : reducedValues.sumBalance}
    return res;
    }

 db.people.mapReduce(
    mapFunction,
    reduceFunction,
    {
    out: "map_reduce_5",
    finalize: finalizeFunction
    }
    )
    
printjson(db.map_reduce_5.find().sort( { _id: 1 } ).toArray())