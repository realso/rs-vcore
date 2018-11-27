export const getPromise = async function(func) {
    return new Promise(
        function(resolve, reject) {
            try {
                resolve(func());
            } catch (e) {
                reject(e);
            }
        }
    )
}