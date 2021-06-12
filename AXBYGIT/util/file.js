const fs = require('fs');

module.exports = class File{
    constructor(path){
        this.path = path;
    }
    read(){
        return JSON.parse(fs.readFileSync(this.path));
    }
    write(data){
        fs.writeFileSync(this.path, JSON.stringify(data, null, 4));
    }
}