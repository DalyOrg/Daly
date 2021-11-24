import { db } from "../common/firestore";


export async function GetItems(){
    let items = await db.collection('items').get();
    return items.docs.map(doc => doc.data());

}