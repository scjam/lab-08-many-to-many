const app = require('./lib/app');

const PORT = process.env.PORT || 7100;

app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
});
