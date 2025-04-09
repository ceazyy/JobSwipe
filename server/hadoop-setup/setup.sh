#!/bin/bash

# Check if running on Windows
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "This script must be run in WSL or a Linux environment"
    exit 1
fi

# Install Java if not present
if ! command -v java &> /dev/null; then
    echo "Installing Java..."
    sudo apt-get update
    sudo apt-get install -y openjdk-11-jdk
fi

# Download and install Hadoop
HADOOP_VERSION="3.3.6"
HADOOP_URL="https://downloads.apache.org/hadoop/common/hadoop-${HADOOP_VERSION}/hadoop-${HADOOP_VERSION}.tar.gz"
HADOOP_DIR="/usr/local/hadoop"

if [ ! -d "$HADOOP_DIR" ]; then
    echo "Downloading Hadoop..."
    wget $HADOOP_URL
    tar -xzf hadoop-${HADOOP_VERSION}.tar.gz
    sudo mv hadoop-${HADOOP_VERSION} $HADOOP_DIR
    rm hadoop-${HADOOP_VERSION}.tar.gz
fi

# Set environment variables
echo "Setting up environment variables..."
cat << EOF | sudo tee /etc/profile.d/hadoop.sh
export HADOOP_HOME=$HADOOP_DIR
export PATH=\$PATH:\$HADOOP_HOME/bin:\$HADOOP_HOME/sbin
export HADOOP_CONF_DIR=\$HADOOP_HOME/etc/hadoop
EOF

# Copy configuration files
echo "Copying configuration files..."
sudo cp core-site.xml $HADOOP_DIR/etc/hadoop/
sudo cp hdfs-site.xml $HADOOP_DIR/etc/hadoop/

# Create necessary directories
echo "Creating Hadoop directories..."
sudo mkdir -p $HADOOP_DIR/tmp/dfs/name
sudo mkdir -p $HADOOP_DIR/tmp/dfs/data
sudo chown -R $USER:$USER $HADOOP_DIR

# Initialize HDFS
echo "Initializing HDFS..."
$HADOOP_DIR/bin/hdfs namenode -format

# Start Hadoop services
echo "Starting Hadoop services..."
$HADOOP_DIR/sbin/start-dfs.sh
$HADOOP_DIR/sbin/start-yarn.sh

echo "Hadoop setup completed!"
echo "You can access the HDFS web interface at http://localhost:9870"
echo "You can access the YARN web interface at http://localhost:8088" 