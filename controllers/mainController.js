const home =  (req, res) => {
    res.send('Welcome to the Notepad API');
    }

const about = (req, res) => {
    res.send('This is a simple Notepad API built with Node.js and Express.');
}





module.exports = {
    home,
    about
};