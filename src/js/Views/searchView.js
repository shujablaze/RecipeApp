import {elements} from './base';

export const getInput=()=>elements.searchInput.value;

/*Adds only one recipe on the UI*/
export const renderRecipe=(recipe)=>{
    const markup=
        `<li>
            <a class="results__link " href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="Test">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${recipe.title} ...</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`
    elements.searchResList.insertAdjacentHTML('beforeend',markup);
}
//Creates the markup code for the buttons
const createButton=(page,type)=>`
    <button class="btn-inline results__btn--${type}" data-goto=${type==='prev'? page-1:page+1}>
        <span>Page ${type==='prev'? page-1:page+1}</span>   
            <svg class="search__icon">
                <use href="img/icons.svg#icon-triangle-${type==='prev'? 'left':'right'}"></use>
            </svg>
    </button>`

//Creates and inserts the button in the UI as per conditions
const renderButtons=(page,numResults,resPerPage)=>{
    const pages=Math.ceil(numResults/resPerPage);
    let button;
    if(page===1 && pages>1){
        //button only to next page
        button=createButton(page,'next');
    }else if(page<pages){
        //both button
        button=`${createButton(page,'prev')}
        ${createButton(page,'next')}`
    }else if(page===pages && pages>1){
        //only button to prev page
        button=createButton(page,'prev');
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin',button);
}


/*Calls the renderRecipe function for all the recipes in the list obtained from API*/
export const renderResult=(recipes,page=1,resPerPage=10)=>{
    if(recipes)
    {   const start=(page-1)*resPerPage;
        const end=page*resPerPage;
        recipes.slice(start,end).forEach(renderRecipe);
        //Calls the buttons to be rendered
        renderButtons(page,recipes.length,resPerPage);
    }
}