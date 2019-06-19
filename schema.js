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
const UserData = require('./UserData.json');
const people = UserData.people;
const departments = UserData.departments;

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
});

// Department Type
const DepartmentType = new GraphQLObjectType({
    name:'Department',
    fields:() => ({
        id: {type: GraphQLString},
        name: {type: GraphQLString}
        // members: {EmployeeType}
    })
});


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
        // Return single department by id
        department:{
            type:DepartmentType,
            args: {
                id:{type: GraphQLString}
            },
            resolve(parentValue, args){
                // for(let i=0; i < departments.length; i++) {
                //     if(departments[i].id == args.id){
                //         return departments[i];
                //     }
                // }
                return axios.get('http://localhost:3000/departments/'+ args.id)
                    .then(res => res.data);
            }
        },
        // Return List of employees
        people:{
            type: new GraphQLList(EmployeeType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/people')
                    .then(res => res.data);
            }
        },
        // Returns List of departments
        departments:{
            type: new GraphQLList(DepartmentType),
            resolve(parentValue, args){
                return axios.get('http://localhost:3000/departments')
                    .then(res => res.data);
            }
        },
        // given department id input, returns List of people by department
        orgChart:{
            type: new GraphQLList,
            resolve(parentValue, args){
                if(args.id == people[i].departmentId){
                    return people[i];
                }
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
                    // optional user adds unique ID, not necessary as provided regardless
                    id:args.id,
                    firstName:args.firstName,
                    lastName:args.lastName,
                    jobTitle:args.jobTitle,
                    departmentId:args.departmentId,
                    managerId:args.managerId
                })
                .then(res => res.data);
            }
        },
        deleteEmployee:{
            type:EmployeeType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)}              
            },
            resolve(parentValue, args){
                return axios.delete('http://localhost:3000/people/'+args.id)
                .then(res => res.data);
            }
        },
        editEmployee:{
            type:EmployeeType,
            args:{
                id: {type: new GraphQLNonNull(GraphQLString)},
                firstName: {type: GraphQLString},
                lastName: {type: GraphQLString},
                jobTitle: {type: GraphQLString},
                departmentId: {type: GraphQLString},
                managerId: {type: GraphQLString}               
            },
            resolve(parentValue, args){
                return axios.patch('http://localhost:3000/people/'+args.id, args)
                .then(res => res.data);
            }
        },
    }
})
module.exports = new GraphQLSchema({
    query: RootQuery,
    mutation
});