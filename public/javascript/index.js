// about Section tabs
(() =>{
    const QualificationSection = document.querySelector(".Qualification-section"),
    tabsContainer = document.querySelector(".quatabs");

    tabsContainer.addEventListener("click", (event)=>{
        
        if(event.target.classList.contains("qua-btn") &&
        !event.target.classList.contains("active")){

        const target = event.target.getAttribute("data-target");


        tabsContainer.querySelector(".active").classList.remove("outer-shadow","active");
        event.target.classList.add("active","outer-shadow");
        QualificationSection.querySelector(".qua-content.active").classList.remove("active");
        QualificationSection.querySelector(target).classList.add("active");
    }  
    })
})();