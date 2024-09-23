
function constructApiPath(apiPath: string, strMap: Record<string, any>) {
  return apiPath
    .split('/')
    .map(data => {
      if (data.charAt(0) === ':') {
        const dataKey = data.replace(':', '');
        let dataString = data;
        Object.entries(strMap).forEach(([key, value]) => {
          if (key === dataKey) {
            dataString = value;
          }
        })
        return dataString;
      }
      return data;
    })
    .join('/')
}

export default constructApiPath;