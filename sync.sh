#!/usr/bin/env bash

VMNAME=$(basename $(readlink -f "$(dirname "$(readlink -f "$0")")/../../../../../../../../"))
DOMAIN=$(basename $(readlink -f "$(dirname "$(readlink -f "$0")")/../../../../../../"))
SRC="${PWD}"
DST="vagrant@${VMNAME}.local:/var/www/domains/${DOMAIN}/html/drupal/sites/all/themes"
CMD="${1}"
CLEAR_CACHE="${2}"

function do_full_sync () {
    cd ${PWD}/../../../../../../../../
    vagrant rsync
    ssh "${VMNAME}.local" 'cd /var/www/domains/'"${DOMAIN}"'/html/drupal && source ~/.bash_profile && drush cc css-js && drush cc theme-registry'
}

function do_css_sync () {
	rsync --exclude '.git/' --exclude '.sass-cache/' --exclude 'node_modules/' --archive --delete --compress --chmod=ugo=rwX "${SRC}" "${DST}"

	if [ "${1}" = "1" ]; then
		ssh "${VMNAME}.local" 'cd /var/www/domains/'"${DOMAIN}"'/html/drupal && source ~/.bash_profile && drush cc css-js'
	else
		echo "Synced CSS and JS files."
	fi
}

function do_php_sync () {
    rsync --exclude '.git/' --exclude '.sass-cache/' --exclude 'node_modules/' --archive --delete --compress --chmod=ugo=rwX "${SRC}" "${DST}"

	if [ "${1}" = "1" ]; then
		ssh "${VMNAME}.local" 'cd /var/www/domains/'"${DOMAIN}"'/html/drupal && source ~/.bash_profile && drush cc theme-registry'
	else
		echo "Synced PHP files."
	fi
}

case $CMD in
    "full")
        do_full_sync
        exit 0
        ;;
    "css")
        do_css_sync "${CLEAR_CACHE}"
        exit 0
        ;;
    "php")
        do_php_sync "${CLEAR_CACHE}"
        exit 0
        ;;
    *)
        echo "Usage: sync.sh [full|css|php]"
        exit 1
        ;;
esac
