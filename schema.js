const axios = require('axios');
const {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLSchema,
    GraphQLList,
    GraphQLNonNull
} = require('graphql');


// import UserData
// const UserData = require('./UserData.json');
// const people = UserData.people;
// const departments = UserData.departments;

// import departments from ('./UserData.json');


// Emoployee Type
const EmployeeType = new GraphQLObjectType({
    name:'Employee',
    fields:() => ({
        id: {type: GraphQLString},
        firstName: {type: GraphQLString},
        lastName: {type: GraphQLString},
        jobTitle: {type: GraphQLString},
        departmentId: {type: GraphQLString},
        managerId: {type: GraphQLString},
    })
})


// Root Query
const RootQuery = new GraphQLObjectType({
    name:'RootQueryType',
    fields:{
        employee:{
            type:EmployeeType,
            args: {
                id:{type: GraphQLString}
            },
            resolve(parentValue, args){
                // for(let i=0; i < people.length; i++) {
                //     if(people[i].id == args.id){
                //         return people[i];
                //     }
                // }
                return axios.get('http://localhost:3000/people/'+ args.id)
                    .then(res => res.data);
            }
        },
        people:{
            type: new GraphQLList(EmployeeType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/people')
                    .then(res => res.data);
            }
        }
    }
});

//  Mutations: ability to add, edit, and delete 'UserData/people'
const mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields:{
        addEmployee:{
            type:EmployeeType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                lastName: {type: new GraphQLNonNull(GraphQLString)},
                jobTitle: {type: new GraphQLNonNull(GraphQLString)},
                departmentId: {type: new GraphQLNonNull(GraphQLString)},
                managerId: {type: GraphQLString}               
            },
            resolve(parentValue, args){
                return axios.post('http://localhost:3000/people',{
                    firstName:args.firstName,
                    lastName:args.lastName,
                    jobTitle:args.jobTitle,
                    departmentId:args.departmentId,
                    managerId:args.managerId
                })
                .then(res => res.data);
            }
        }
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});