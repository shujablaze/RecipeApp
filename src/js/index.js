import Search from './Models/Search';
import Recipe from './Models/Recipe';
import * as recipeView from './views/recipeView';
import List from './Models/List';
import Like from './Models/Like';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import * as searchView from './views/searchView';
import {elements} from './views/base';
import Likes from './Models/Like';

const state = {};
const controlSearch=async ()=>
{
    const query=searchView.getInput();
     
    if(query)
    {   /*Creating a new property for object state from Search class for a recipe*/
        state.search=new Search(query); 
        /*This awaits the recipes from the async function in search module*/
        await state.search.getResults();

        /*Clears the fields */
        elements.searchInput.value='';
        elements.searchResList.innerHTML='';
        elements.searchResPages.innerHTML='';
       
        /*Prints the list of recipes on the UI*/
        searchView.renderResult(state.search.result)
        
    }
}
/*Event listener which calls the main function*/
elements.searchForm.addEventListener('submit',e=>
{
    e.preventDefault();
    controlSearch();
});

//To change page
elements.searchResPages.addEventListener('click',e=>{
    const btn=e.target.closest('.btn-inline')
    if(btn){
        //Stores about which page to go on
        const goToPage=parseInt(btn.dataset.goto,10);
        
        //Clears the recipes and buttons in the recipe list
        elements.searchResList.innerHTML='';
        elements.searchResPages.innerHTML='';
        
        //This again calls for the next page to be printed
        searchView.renderResult(state.search.result,goToPage);
    }
})

/** 
 * RECIPE CONTROLLER
 */
const controlRecipe = async () => {
    // Get ID from url
    const id = window.location.hash.replace('#', '');

    if (id) {
        // Prepare UI for changes by deleating previous recipe if any
        recipeView.clearRecipe();


        // Create new recipe object
        state.recipe = new Recipe(id);

        try {
            // Get recipe data and parse ingredients
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            // Calculate servings and time
            state.recipe.calcTime();
            state.recipe.calcServings();
    
            // Render recipe
            recipeView.renderRecipe(state.recipe,
                state.likes.isLiked(id));

        } catch (err) {
            alert('Error processing recipe!');
        }
    }
};
 
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

/**
 * List Controller
 */


const controlList=()=>{

    if(!state.list) state.list=new List();
//Creates the items array for all ingredients and intructs to render them on the UI 
    state.recipe.ingredients.forEach(el=>{
        const item= state.list.addItem(el.count,el.unit,el.ingredient);
        listView.renderItem(item);
    });

}

//Event Handler for shopping List
elements.shopping.addEventListener('click',e=>{
    const id=e.target.closest('.shopping__item').dataset.itemid;

    if(e.target.matches('.shopping__delete,.shopping__delete *')){
        //Deletes the item from state list
        state.list.deleteItem(id);
        //Deletes the item from UI
        listView.deleteItem(id);
    }else if(e.target.matches('.shopping__count-value')){
        const val=parseFloat(e.target.value);
        state.list.updateCount(id,val);
    }
})


/**
 * Like Controller
 */
const controlLike=()=>{
    if(!state.likes) state.likes=new Likes();
    
    const currentID=state.recipe.id;
    //User has not liked current recipe
    if(!state.likes.isLiked(currentID)){
        //Add like to the state
        const newLike=state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )
        //Toggle the like button
        likesView.toggleLikesBtn(true);
        
        //Add like to UI list
        likesView.renderLike(newLike);

    }else{
        //Remove like to the state
        state.likes.deleteLike(currentID);
        //Toggle the like button
        likesView.toggleLikesBtn(false);
        
        //Remove like to UI list
        likesView.deleteLike(currentID);

    }
    likesView.toggleLikesMenu(state.likes.getNumLikes());
};

//Restore liked recipe on page load
window.addEventListener('load',()=>{
    state.likes=new Likes();

    //Restore likes
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikesMenu(state.likes.getNumLikes());

    //REnder the likes
    state.likes.likes.forEach(like=>likesView.renderLike(like));
})


elements.recipe.addEventListener('click',e=>{
    if(e.target.matches('.btn-decrease, .btn-decrease *')){
        //Decrease buttn is clicked
        if (state.recipe.servings>1)
        {state.recipe.updateServings('dec')
        recipeView.updateServingsIngredients(state.recipe)}
    }else if(e.target.matches('.btn-increase, .btn-increase *')){
        //Increase buttn is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    }else if(e.target.matches('.recipe__btn--add, .recipe__btn--add *')){
        controlList();
    }else if(e.target.matches('.recipe__love , .recipe__love *')){
        controlLike();
    }
})
