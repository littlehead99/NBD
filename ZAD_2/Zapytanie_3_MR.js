var mapFunction = function(){
    emit(this.job, {
        count : 0,
        })
};
    
var reduceFunction = function(job,jobCount){
    var result = {count:0}
    jobCount.forEach(j => {
    result.count++;
    });
    return result;
    };
    
 db.people.mapReduce(
    mapFunction,
    reduceFunction,
    {
    out: "map_reduce_3"
    }
    )
    
printjson(db.map_reduce_3.find().sort( { _id: 1 } ).toArray())