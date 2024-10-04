import { Transform, pipeline } from "stream";

const transform = async () => {
    const reversedInput = new Transform({
        transform(chunk, encoding, callback){
            callback(null, chunk.toString().split('').reverse().join('')+'\n');
        }
    });
    pipeline(
        process.stdin,
        reversedInput,
        process.stdout,
        (error) => {
            throw new Error(`Pipeline crash: ${error}`);
        }
    )
};

await transform();