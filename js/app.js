// references to DOM elements
const footerEl = document.querySelector("footer > .container");
const clubContainerEl = document.querySelector("#main > .row");

// category to student organizations map
const categories = {};

/**
 * Initialize the UI components on page load.
 */
(async function initUI() {
     // listen for keypresses
     document.onkeydown = e => {
        // if the user presses the space bar
        if (e.key == " ")
        {
            // prevent the space key from actually doing anything
            e.preventDefault();

            getRandomOrgs();
        }
    }

    // get list of student organizations
    const response = await fetch("data/studentOrgsList.json");
    const data = (await response.json()).studentOrganizations;

    // sort the list of organizations into categories
    data.reduce((a, b) => {
        // if the category already has an array
        if (a[b.category])
        {
            a[b.category].push(b);
        }
        // create new array
        else 
        {
            a[b.category] = [b];
        }

        return a;
    }, categories);

    // for each category, create a checkbox
    Object.keys(categories)
        .forEach(category => {
            // create a checkbox
            const checkbox = document.createElement("input");
            checkbox.className = "form-check-input";
            checkbox.type = "checkbox";
            checkbox.id = category;

            // un-check the checkbox if it is not for undergraduates
            if (category == "For Graduate Students" || category == "For Faculty & Staff") 
            {
                checkbox.checked = false;
            }
            // otherwise, enable the checkbox
            else
            {
                checkbox.checked = true;
            }

            // create a label for the checkbox with the category name
            const label = document.createElement("label");
            label.className = "form-check-label";
            label.setAttribute("for", category);
            label.textContent = category;

            // add the checkbox and the label to the footer
            footerEl.appendChild(checkbox);
            footerEl.appendChild(label);
        });

    // show a random organization smash together to start out
    getRandomOrgs();
})();

/**
 * Get random student organizations to display side-by-side.
 */
function getRandomOrgs() {
    // get the names of the categories for the checkboxes that are enabled
    const enabledCategories = [...document.querySelectorAll("input[type='checkbox']:checked")]
        .map(checkbox => checkbox.id);

    const numOrgs = 2;
    for (let i = 0; i < numOrgs; i++) 
    {
        // get a random student organization category
        const randomCategoryName = enabledCategories[Math.floor(Math.random() * enabledCategories.length)];
        const randomCategory = categories[randomCategoryName];

        // get a random student organization within that category
        const randomOrganization = randomCategory[Math.floor(Math.random() * randomCategory.length)];

        // create a card element
        const card = document.createElement("div");
        card.className = "card";

        // create an image element for the club avatar
        const img = document.createElement("img");
        img.src = randomOrganization.avatar;
        img.width = "200";
        card.appendChild(img);

        // create a title header for the organization name
        const title = document.createElement("h2");
        title.textContent = randomOrganization.name;
        card.appendChild(title);

        // add the card to the club container
        clubContainerEl.appendChild(card);
    }
}