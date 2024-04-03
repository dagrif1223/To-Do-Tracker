// To-do tracker
import chalkAnimation from "chalk-animation";
import { createSpinner } from "nanospinner";
import chalk from "chalk";
import inquirer from "inquirer";

// Task class
class Task {
    constructor(task) {
        this.task = task
    }
}
const resolveAnimations = (ms = 2000) => new Promise((resolve) => setTimeout(resolve, ms));
let username;
const spinner = createSpinner('process loading. . .')
let allTasks = []
const greenCheckmark = '\u2705';
// start the app
async function startApp() {
    //welcome message utilizing the chalk animation package
    const welcomeMsg = chalkAnimation.neon(`Welcome to your very own To-Do Tracker! \n `);
     
    await resolveAnimations();
    //stop the animation
    welcomeMsg.stop();
    //prompt for the game
    console.log(`
    Here you can keep track of any tasks you need to complete.
    You can do the following:
    1. ${chalk.yellowBright('Add')} new tasks.
    2. ${chalk.greenBright('Mark')} tasks as complete.
    3. ${chalk.redBright('Delete')} tasks.
    4. ${chalk.blueBright('View')} your task list.

    `)

};

async function main(){
    await startApp();
    await userInfo();

}
// get the user's name
async function userInfo(){
    const answers = await inquirer.prompt({
        name: 'user_name',
        type: 'input',
        message: `${chalk.cyan('Before we get started, please enter your name.')}`
    });
    username = answers.user_name;
    await pathQuestion();

};
// ask the user what they want to do
async function pathQuestion() {
    const answers = await inquirer.prompt({
        name: 'question_1',
        type: 'list',
        message: `Hi ${username}, what would you like to do? `,
    choices: [
        { name:`${chalk.yellowBright('Add')} new tasks.`, value: 'add' },
        { name: `${chalk.greenBright('Mark')} tasks as complete.`, value: 'mark' },
        { name: `${chalk.redBright('Delete')} tasks.`, value: 'delete' },
        {name: `${chalk.blueBright('View')} your task list.`, value: 'view'}
    ],
    });
    if(answers.question_1 === 'add') {
        await addTask()
    } else if (answers.question_1 === 'mark') {
        await markTask()
    } 
    else if (answers.question_1 === 'delete') {
        await deleteTask()
         
    } 
    else if (answers.question_1 === 'view') {
        await viewTasks()
         
    }
    
}
// add a task to the list
async function addTask(){
    const answers = await inquirer.prompt({
        name: 'addTask',
        type: 'str',
        message: `What task would you like to add? \n`,
        
    });
    let newTask = new Task(answers.addTask)
    if (allTasks.includes(newTask.task)){
        spinner.warn({text: `${username}, that task has already been added.`})
    } else {
        allTasks.push(chalk.bold(newTask.task))
    }
    if(await keepGoing()){
        await pathQuestion()
    }
    else {
        process.exit(1)
    }

}
// asks the user if they want to keep going
async function keepGoing(){
    const answers = await inquirer.prompt({
        name: 'response',
        type: 'list',
        message: 'Would you like to do anything else?',
        choices: [
            {name: `Yes`, value: true},
            {name: `No`, value: false},
        ],
    });
    return answers.response
}

// deletes a task from the list
async function deleteTask(){
    if (allTasks.length === 0) {
        spinner.warn({text: `${username}, your task list is empty.`})

    }
    else {
        const answers = await inquirer.prompt({
            name: 'response',
            type: 'list',
            message: 'Which task do you want to delete?',
            choices: allTasks
        })
        let deletedTask = answers.response
        allTasks = allTasks.filter((task) => task !== deletedTask);
    }
    
    if(await keepGoing()){
        await pathQuestion()
    }
    else {
        process.exit(1)
    }

}

// marks a task as complete
async function markTask(){
    if (allTasks.length === 0) {
        spinner.warn({text: `${username}, your task list is empty.`})
    }
    else {
        const answers = await inquirer.prompt({
            name: 'response',
            type: 'list',
            message: 'Which task do you want to mark as complete?',
            choices: allTasks
        })
        let completedTask = answers.response
        for (let i = 0; i <allTasks.length; i++){
            if (allTasks[i] === completedTask){
                if (allTasks[i].includes(greenCheckmark)){
                    spinner.warn({text: `${username}, that task is already complete.`})
                }
                else {
                    allTasks[i] = allTasks[i]  + ' ' + greenCheckmark 
                }
                
            }
        }
    }
    if (await keepGoing()){
        await pathQuestion()
    }
    else {
        process.exit(1)
    }
   
    
}

// lets the user view all tasks
async function viewTasks(){
    if (allTasks.length === 0) {
        spinner.warn({text: `${username}, your task list is empty.`})
    }
    else {
        console.log(chalk.magenta.underline('Here is your list of tasks:'))
        for (let task of allTasks){
            console.log(task)
        }
    }
   
    if(await keepGoing()){
        await pathQuestion()
    }
    else {
        process.exit(1)
    }

}


main()


