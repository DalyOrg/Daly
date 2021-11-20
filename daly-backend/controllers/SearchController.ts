import {db} from '../common/firestore'

const validQuizFields = [
    'categories',
    'timeLimitSeconds'
]

const validPlatformFields = [
]

interface SearchParams{
    query: string
    filters?: [{
        field: string
        operator: string
        value: any
    }]
    sort?: {
        field: string
        order: 'asc' | 'desc'
    }
    limit?: number
}
export async function SubmitSearch({query, filters, sort, limit}: SearchParams){
    let quizQuery = db.collection('quizzes').where('name', '>=', query).where('name', '<=', query + '\uf8ff');
    if(filters){
        for(let filter of filters){
            if(validQuizFields.includes(filter.field)){
                // @ts-ignore we want to keep the operator open to change
                quizQuery = quizQuery.where(filter.field, filter.operator, filter.value); 
            }
        }
    }
    if(sort){
        if(validQuizFields.includes(sort.field)){
            quizQuery = quizQuery.orderBy(sort.field, sort.order);
        }
    }
    let quizQueryRes = await quizQuery.limit(limit ? limit : 25).get();

    let platformQuery = db.collection('platforms').where('name', '>=', query).where('name', '<=', query + '\uf8ff');
    if(filters){
        for(let filter of filters){
            if(validPlatformFields.includes(filter.field)){
                // @ts-ignore we want to keep the operator open to change
                platformQuery = platformQuery.where(filter.field, filter.operator, filter.value); 
            }
        }
    }
    if(sort){
        if(validPlatformFields.includes(sort.field)){
            platformQuery = platformQuery.orderBy(sort.field, sort.order);
        }
    }
    let platformQueryRes = await platformQuery.limit(limit ? limit : 25).get();

    let results = quizQueryRes.docs.map((doc) => {return {id: doc.id, type: 'quiz'}});
    results = results.concat(platformQueryRes.docs.map((doc) => {return {id: doc.id, type: 'platform'}}))
    return {results: results};
}