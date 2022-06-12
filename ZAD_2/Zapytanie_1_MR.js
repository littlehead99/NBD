var mapFunction = function(){
    emit(this.sex, {
    count : 0,
    height: Number(this.height),
    weight: Number(this.weight)
    })
    };
    
    
    var reduceFunction = function(sex, heightAndWeightObjects){
    var result = {count:0,height:0,weight:0}
    heightAndWeightObjects.forEach(e => {
    result.count++;
    result.height+=e.height;
    result.weight +=e.weight
    });
    return result;
    };
    
    
    var finalizeFunction = function(sex, reducedValues) {
    var res = { avgWeight : reducedValues.weight/reducedValues.count,
    avgHeight : reducedValues.height/reducedValues.count}
    return res;
    }
    
    
    db.people.mapReduce(
    mapFunction,
    reduceFunction,
    {
    out: "map_reduce_1",
    finalize: finalizeFunction
    }
    )
    
    
    printjson(db.map_reduce_1.find().sort( { _id: 1 } ).toArray())