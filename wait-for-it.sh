set -e

host=$(echo "$1" | cut -d':' -f1)
port=$(echo "$1" | cut -d':' -f2)
shift
shift

until nc -z "$host" "$port"; do
  echo "Waiting for $host:$port..."
  sleep 1
done

exec "$@"
