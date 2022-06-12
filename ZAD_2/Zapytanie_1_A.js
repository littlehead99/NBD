printjson(db.people.aggregate( 
            [
                {
                    $group:
                        {
                            _id: "$sex",
                            avgWeight : { $avg: { $convert: { input: "$weight", to: "double" }}},
                            avgHeight : { $avg: { $convert: { input: "$height", to: "double" }}}
                        }
                }
            ]
        )
    .toArray())
