import { CollectionReference, Query } from "firebase-admin/firestore";
import { db } from "../common/firestore";

export async function getData(route: string, query: string | Object){
    const collection = db.collection(route);

    if(typeof query === 'string'){
        let data = await collection.doc(query).get();
        return {...data.data(), id: data.id}
    }
    else if (typeof query === 'object' && !Array.isArray(query)
                && query !== {}){
        let collQuery: CollectionReference | Query = collection
        for(let field in Object.keys(query)){
            collQuery = collQuery.where(field, '==', query[field]);
        }
        let data = await collQuery.get();
        let dataArr = [];
        data.docs.forEach((doc) => {
            dataArr.push(
                {...doc.data(), id: doc.id}
            );
        })
        return dataArr;
    }
    else{
        throw new Error()
    }
}

export async function postData(route: string, newData: Object){
    const collection = db.collection(route);

    let res = await collection.add(newData);
    return res.id;
}

export async function updateData(route: string, query: string, newData: Object){
    const doc = db.collection(route).doc(query);

    let res = await doc.update(newData);
    return true;
}

export async function deleteData(route: string, query: string){
    const doc = db.collection(route).doc(query);

    let res = await doc.delete();
    return true;
}
