module.exports = {
    '0000': () => 'Unknown error.',
    '0001': (name) => `Missing declaration ${name}.`,
    '0002': (varName) => `Found more than 1 reserved var definition with name ${varName}`,
    '0003': (method) => `Invalid HTTP method ${method}`
}