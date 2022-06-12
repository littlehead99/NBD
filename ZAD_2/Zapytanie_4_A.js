printjson(db.people.aggregate( 
    [
        {
            $group:
                {
                    _id: "$nationality",
                    avgBMI : { $avg: 
                        { 
                            $divide : [ {$convert : { input: "$weight", to: "double" }}, 
                                { $pow: [
                                    { $divide : [ {$convert : { input: "$height", to: "double" }}, 100]}, 2]
                                }
                            ]
                        }
                    },
                    minBMI : { $min: 
                        { 
                            $divide : [ {$convert : { input: "$weight", to: "double" }}, 
                                { $pow: [
                                    { $divide : [ {$convert : { input: "$height", to: "double" }}, 100]}, 2]
                                }
                            ]
                        }
                    },
                    maxBMI : { $max: 
                        { 
                            $divide : [ {$convert : { input: "$weight", to: "double" }}, 
                                { $pow: [
                                    { $divide : [ {$convert : { input: "$height", to: "double" }}, 100]}, 2]
                                }
                            ]
                        }
                    }
                }
        },
        { $sort: { _id: 1 } }
    ]
)
.toArray())
