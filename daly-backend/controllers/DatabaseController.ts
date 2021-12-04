import { CollectionReference, Query } from "firebase-admin/firestore";
import { db } from "../common/firestore";

export async function getData(route: string, query: string | Object): Promise<any>{
    const collection = db.collection(route);
    let err: StdError = {
        status: 404,
        message: `Requested ${route} data could not be found.`
    };

    if(typeof query === 'string'){
        let data = await collection.doc(query).get();
        if(!data.exists)
            throw err;
        return {...data.data(), id: data.id}
    }
    else if (typeof query === 'object' && !Array.isArray(query)
                && query !== {}){
        let collQuery: CollectionReference | Query = collection
        for(let field of Object.keys(query)){
            collQuery = collQuery.where(field, '==', query[field]);
        }
        let data = await collQuery.get();
        let dataArr = [];
        data.docs.forEach((doc) => {
            dataArr.push(
                {...doc.data(), id: doc.id}
            );
        })
        return dataArr; // can be []
    }
    else{
        throw err;
    }
}

export async function postData(route: string, newData: Object){
    const collection = db.collection(route);

    try{
        let res = await collection.add(newData);
        return res.id;
    }
    catch(e){
        let err: StdError = {
            status: 500,
            message: `The ${route} data could not be created.`
        };
        throw err;
    }
}

export async function updateData(route: string, query: string, newData: Object){
    const doc = db.collection(route).doc(query);

    try{
        let res = await doc.update(newData);
    }
    catch(e){
        let err: StdError = {
            status: 500,
            message: `The ${route} data could not be updated.`
        };
        throw err;
    }
}

export async function deleteData(route: string, query: string){
    const doc = db.collection(route).doc(query);

    try{
        let res = await doc.delete();
    }
    catch(e){
        let err: StdError = {
            status: 500,
            message: `The ${route} data could not be deleted.`
        };
        throw err;
    }
}
