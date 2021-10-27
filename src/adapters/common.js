
export function wrapErrorHandling(adapter){
    return function(){
        try{
            return adapter.apply(this, arguments)
        } catch(err){
            // do stuff
        }
    }
}
