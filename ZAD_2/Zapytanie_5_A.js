printjson(db.people.aggregate( 
    [
        { $match : { nationality : "Poland", sex:"Female" } },
        { $unwind: "$credit" },
        {
            $group:
                {
                    _id: "$credit.currency",
                    avgBalance : { $avg: { $convert: { input: "$credit.balance", to: "double" }}},
                    sumBalance : { $sum: { $convert: { input: "$credit.balance", to: "double" }}},
                }
        },
        { $sort: { _id: 1 } }
    ]
)
.toArray())