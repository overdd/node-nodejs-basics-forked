const parseEnv = () => {
    let output = "";

    for (const variable in process.env) {
      variable.slice(0, 4) === "RSS_" ? output += `${variable}=${process.env[variable]}; ` : variable;
    };
    output = output.slice(0, -2);
    console.log(output);
};

parseEnv();