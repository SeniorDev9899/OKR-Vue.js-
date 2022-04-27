export const converter = param => {
    var result = [];
    param.forEach(function(a) {
        result.push(a);
        if (Array.isArray(a.dp_users)) {
            result = result.concat(converter(a.dp_users));
        }
    });
    return result;
}

export default { converter };