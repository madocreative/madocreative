const fs = require('fs');

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const fullPath = dir + '/' + file;
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(fullPath));
        } else {
            if (fullPath.endsWith('.tsx')) results.push(fullPath);
        }
    });
    return results;
}

const files = walk('./src/app/admin');
files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');

    // Replace specific known glassmorphism backgrounds with solid colors
    content = content.replace(/bg-\[#0a0a08\]\/80/g, 'bg-[#0a0a08]');
    content = content.replace(/bg-\[#0a0a08\]\/95/g, 'bg-[#0a0a08]');

    // Remove all backdrop-blur classes
    content = content.replace(/ backdrop-blur-[a-z0-9]+/g, '');

    fs.writeFileSync(file, content);
});

console.log('Removed glassmorphism classes from admin panel.');
