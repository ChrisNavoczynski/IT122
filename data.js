//Dungeons & Dragons Party List

let heroes = [
    {name : "Lance", class : "Fighter", align : "NG", level : 3},
    {name : "Shadow", class : "Rogue", align : "CN", level : 2},
    {name : "Fib", class : "Bard", align : "CN", level : 1},
    {name : "Bow", class : "Ranger", align : "CG", level : 3},
    {name : "Casta", class : "Sorcerer", align : "LN", level : 2}
];

const getAll = () => {
        return heroes;
};


const getItem = (name) => {
    return heroes.find((hero) => {
        return hero.name === name;
    });
}

export { getAll, getItem };