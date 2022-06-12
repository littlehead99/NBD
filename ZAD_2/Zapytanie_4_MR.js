var mapFunction = function(){
    emit(this.nationality, {
    height: Number(this.height),
    weight: Number(this.weight)
    })
    };
    
    var reduceFunction = function(nationality, heightAndWeightObjects){
    var result = {count:0,sumBMI:0,minBMI:100, maxBMI:0}
    heightAndWeightObjects.forEach(e => {
        currentBMI = (e.weight)/((e.height*0.01)**2)
        result.count++;
        result.sumBMI += currentBMI
        if(result.minBMI > currentBMI)
        {
            result.minBMI = currentBMI
        }
        if(result.maxBMI < currentBMI)
        {
            result.maxBMI = currentBMI
        }
    });
    return result;
    };
    
    var finalizeFunction = function(sex, reducedValues) {
    var res = { avgBMI : reducedValues.sumBMI/reducedValues.count,
    minBMI : reducedValues.minBMI,
    maxBMI : reducedValues.maxBMI}
    return res;
    }
    
    
    db.people.mapReduce(
    mapFunction,
    reduceFunction,
    {
    out: "map_reduce_4",
    finalize: finalizeFunction
    }
    )
    
    
    printjson(db.map_reduce_4.find().sort( { _id: 1 } ).toArray())