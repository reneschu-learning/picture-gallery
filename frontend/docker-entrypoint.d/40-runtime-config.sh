#!/bin/sh
set -eu

OUTPUT_FILE="/usr/share/nginx/html/runtime-config.js"
NOT_SET_VALUE="N/A"
MISSING_FILE_VALUE="ERROR: File does not exist"

is_set() {
  var_name="$1"
  eval "[ \"\${$var_name+x}\" = \"x\" ]"
}

value_or_na() {
  var_name="$1"
  if is_set "$var_name"; then
    eval "printf '%s' \"\${$var_name}\""
  else
    printf '%s' "$NOT_SET_VALUE"
  fi
}

file_content_or_status() {
  var_name="$1"

  if ! is_set "$var_name"; then
    printf '%s' "$NOT_SET_VALUE"
    return
  fi

  eval "file_path=\${$var_name}"

  if [ -f "$file_path" ]; then
    cat "$file_path"
  else
    printf '%s' "$MISSING_FILE_VALUE"
  fi
}

js_escape() {
  sed -e 's/\\/\\\\/g' \
      -e 's/"/\\"/g' \
      -e ':a;N;$!ba;s/\n/\\n/g' \
      -e 's/\r/\\r/g'
}

config_var1="$(value_or_na CONFIG_VAR1)"
secret1="$(value_or_na SECRET1)"
config_file="$(value_or_na CONFIG_FILE)"
config_file_content="$(file_content_or_status CONFIG_FILE)"
config_file_vol="$(value_or_na CONFIG_FILE_VOL)"
config_file_vol_content="$(file_content_or_status CONFIG_FILE_VOL)"

cat > "$OUTPUT_FILE" <<EOF
window.__RUNTIME_CONFIG__ = {
  CONFIG_VAR1: "$(printf '%s' "$config_var1" | js_escape)",
  SECRET1: "$(printf '%s' "$secret1" | js_escape)",
  CONFIG_FILE: "$(printf '%s' "$config_file" | js_escape)",
  CONFIG_FILE_CONTENT: "$(printf '%s' "$config_file_content" | js_escape)",
  CONFIG_FILE_VOL: "$(printf '%s' "$config_file_vol" | js_escape)",
  CONFIG_FILE_VOL_CONTENT: "$(printf '%s' "$config_file_vol_content" | js_escape)"
};
EOF