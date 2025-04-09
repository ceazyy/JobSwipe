# Hadoop Setup Guide

## Prerequisites
- Java 8 or later
- SSH
- Windows Subsystem for Linux (WSL) or Virtual Machine

## Installation Steps

1. Download and Install Hadoop
```bash
wget https://downloads.apache.org/hadoop/common/hadoop-3.3.6/hadoop-3.3.6.tar.gz
tar -xzf hadoop-3.3.6.tar.gz
mv hadoop-3.3.6 /usr/local/hadoop
```

2. Set Environment Variables
Add to ~/.bashrc:
```bash
export HADOOP_HOME=/usr/local/hadoop
export PATH=$PATH:$HADOOP_HOME/bin:$HADOOP_HOME/sbin
export HADOOP_CONF_DIR=$HADOOP_HOME/etc/hadoop
```

3. Configure Hadoop
- Edit core-site.xml
- Edit hdfs-site.xml
- Edit mapred-site.xml
- Edit yarn-site.xml

4. Initialize HDFS
```bash
hdfs namenode -format
```

5. Start Hadoop Services
```bash
start-dfs.sh
start-yarn.sh
```

## Data Migration Strategy

1. Export MongoDB Data
```bash
mongoexport --db jobswipe --collection users --out users.json
mongoexport --db jobswipe --collection jobs --out jobs.json
mongoexport --db jobswipe --collection matches --out matches.json
```

2. Transform Data for HDFS
- Convert JSON documents to Avro/Parquet format
- Organize data in HDFS directory structure:
  /user/jobswipe/
    /users/
    /jobs/
    /matches/
    /resumes/

3. Load Data into HDFS
```bash
hdfs dfs -put users.avro /user/jobswipe/users/
hdfs dfs -put jobs.avro /user/jobswipe/jobs/
hdfs dfs -put matches.avro /user/jobswipe/matches/
``` 