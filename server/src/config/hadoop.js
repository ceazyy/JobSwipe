const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);

class HadoopAdapter {
    constructor() {
        this.hdfsBasePath = '/user/jobswipe';
    }

    async initialize() {
        try {
            // Create base directory structure
            await this.createDirectory(this.hdfsBasePath);
            await this.createDirectory(`${this.hdfsBasePath}/users`);
            await this.createDirectory(`${this.hdfsBasePath}/jobs`);
            await this.createDirectory(`${this.hdfsBasePath}/matches`);
            await this.createDirectory(`${this.hdfsBasePath}/resumes`);
        } catch (error) {
            console.error('Failed to initialize Hadoop directories:', error);
            throw error;
        }
    }

    async createDirectory(path) {
        try {
            await execPromise(`hdfs dfs -mkdir -p ${path}`);
        } catch (error) {
            if (!error.message.includes('already exists')) {
                throw error;
            }
        }
    }

    async writeData(collection, id, data) {
        const tempFile = `/tmp/${collection}_${id}.json`;
        const hdfsPath = `${this.hdfsBasePath}/${collection}/${id}.json`;
        
        try {
            // Write to temporary file
            await util.promisify(require('fs').writeFile)(tempFile, JSON.stringify(data));
            
            // Copy to HDFS
            await execPromise(`hdfs dfs -put -f ${tempFile} ${hdfsPath}`);
            
            // Clean up temp file
            await util.promisify(require('fs').unlink)(tempFile);
        } catch (error) {
            console.error(`Failed to write data to HDFS: ${error.message}`);
            throw error;
        }
    }

    async readData(collection, id) {
        const hdfsPath = `${this.hdfsBasePath}/${collection}/${id}.json`;
        const tempFile = `/tmp/${collection}_${id}.json`;
        
        try {
            // Copy from HDFS to temp file
            await execPromise(`hdfs dfs -get ${hdfsPath} ${tempFile}`);
            
            // Read and parse data
            const data = await util.promisify(require('fs').readFile)(tempFile, 'utf8');
            
            // Clean up temp file
            await util.promisify(require('fs').unlink)(tempFile);
            
            return JSON.parse(data);
        } catch (error) {
            if (error.message.includes('No such file or directory')) {
                return null;
            }
            throw error;
        }
    }

    async listData(collection) {
        const hdfsPath = `${this.hdfsBasePath}/${collection}`;
        
        try {
            const { stdout } = await execPromise(`hdfs dfs -ls ${hdfsPath}`);
            return stdout
                .split('\n')
                .filter(line => line.endsWith('.json'))
                .map(line => {
                    const parts = line.split(' ');
                    return parts[parts.length - 1].split('/').pop().replace('.json', '');
                });
        } catch (error) {
            console.error(`Failed to list data from HDFS: ${error.message}`);
            return [];
        }
    }

    async deleteData(collection, id) {
        const hdfsPath = `${this.hdfsBasePath}/${collection}/${id}.json`;
        
        try {
            await execPromise(`hdfs dfs -rm ${hdfsPath}`);
        } catch (error) {
            console.error(`Failed to delete data from HDFS: ${error.message}`);
            throw error;
        }
    }
}

module.exports = new HadoopAdapter(); 