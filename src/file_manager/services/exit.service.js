export class ExitService{
    constructor() {}
    static sayBye() {
        console.log(`Thank you for using File Manager, ${process.env.FILEMANAGERUSERNAME 
        ? process.env.FILEMANAGERUSERNAME 
        : "noname"}, goodbye!`)
        process.exit();  
    }
}
