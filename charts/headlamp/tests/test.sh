#!/bin/bash

# Enable strict mode
set -euo pipefail

# Set up variables
CHART_DIR="./charts/headlamp"
TEST_CASES_DIR="${CHART_DIR}/tests/test_cases"
EXPECTED_TEMPLATES_DIR="${CHART_DIR}/tests/expected_templates"

# Get the current chart, app and image version
CURRENT_CHART_VERSION=$(grep '^version:' ${CHART_DIR}/Chart.yaml | awk '{print $2}')
CURRENT_APP_VERSION=$(grep '^appVersion:' ${CHART_DIR}/Chart.yaml | awk '{print $2}')
CURRENT_IMAGE_VERSION=$(grep '^appVersion:' ${CHART_DIR}/Chart.yaml | awk '{print $2}')

# Function to render templates for a specific values file
render_templates() {
    values_file="$1"
    output_dir="$2"
    # Render templates
    helm template headlamp ${CHART_DIR} --values ${values_file} > "${output_dir}/rendered_templates.yaml"
}

# Function to update expected templates with the current versions
update_versions_in_expected_templates() {
    expected_file="$1"
    # Replace the old chart version with the current chart version
    sed -i.bak "s/helm.sh\/chart: headlamp-[0-9]\+\.[0-9]\+\.[0-9]\+/helm.sh\/chart: headlamp-${CURRENT_CHART_VERSION}/g" "${expected_file}"
    # Replace the old app version with the current app version
    sed -i.bak "s/app.kubernetes.io\/version: \"[0-9]\+\.[0-9]\+\.[0-9]\+\"/app.kubernetes.io\/version: \"${CURRENT_APP_VERSION}\"/g" "${expected_file}"
    # Replace the old image version with the current image version
    sed -i.bak "s/ghcr.io\/headlamp-k8s\/headlamp:v[0-9]\+\.[0-9]\+\.[0-9]\+/ghcr.io\/headlamp-k8s\/headlamp:v${CURRENT_IMAGE_VERSION}/g" "${expected_file}"
    rm -f "${expected_file}.bak"
}

# Function to compare rendered templates with expected templates
compare_templates() {
    values_file="$1"
    output_dir="$2"
    expected_file="$3"
    # Compare rendered template with expected template
    if ! diff_output=$(diff -u "${output_dir}/rendered_templates.yaml" "${expected_file}" 2>&1); then
        echo "Template test failed for ${values_file} against ${expected_file}:"
        echo "${diff_output}"
        exit 1
    else
        echo "Template test passed for ${values_file} against ${expected_file}"
    fi
}

# Check for default values.yaml test case
mkdir -p "${CHART_DIR}/tests/defaultvaluetest"
render_templates "${CHART_DIR}/values.yaml" ${CHART_DIR}/tests/defaultvaluetest
update_versions_in_expected_templates ${CHART_DIR}/tests/defaultvaluetest/rendered_templates.yaml
compare_templates "${CHART_DIR}/values.yaml" ${CHART_DIR}/tests/defaultvaluetest ${CHART_DIR}/tests/defaultvaluetest/rendered_templates.yaml
rm -rf ${CHART_DIR}/tests/defaultvaluetest

# Check if TEST_CASES_DIR is not empty
if [ "$(ls -A ${TEST_CASES_DIR})" ]; then
    # Iterate over each test case
    for values_file in ${TEST_CASES_DIR}/*; do
        case_name=$(basename "${values_file}")
        output_dir="${CHART_DIR}/tests/${case_name}_output"
        expected_file="${EXPECTED_TEMPLATES_DIR}/${case_name}"

        # Check if expected template exists for the current test case
        if [ -f "${expected_file}" ]; then
            # Create output directory for the current test case
            mkdir -p "${output_dir}"
            # Render templates for the current test case
            render_templates "${values_file}" "${output_dir}"
            # Update expected template versions
            update_versions_in_expected_templates "${expected_file}"
            # Compare rendered templates with expected templates for the current test case
            compare_templates "${values_file}" "${output_dir}" "${expected_file}"
            # Clean up temporary files
            rm -rf "${output_dir}"
        else
            echo "No expected template found for ${values_file}. Skipping template testing."
        fi
    done
else
    echo "No test cases found in ${TEST_CASES_DIR}. Skipping template testing."
fi

echo "Template testing completed."
