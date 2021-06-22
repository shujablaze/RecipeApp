import axios from 'axios';
/* class which calls and store data from API*/
export default class Search{
    constructor(query){
        this.query=query
    }
    /* async function which promises the data from API*/
    async getResults(){
        try{
            /* res stores the data from API after it returns */
            const res=await axios(`https://forkify-api.herokuapp.com/api/search?&q=${this.query}`);
            this.result=res.data.recipes;
            
        }catch(error){
            alert(error);
        }
    }
}