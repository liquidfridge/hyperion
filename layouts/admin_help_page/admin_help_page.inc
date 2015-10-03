<?php

/**
 * @file
 * Admin help page
 */
// Plugin definition
$plugin = array(
  'title' => t('Admin help page'),
  'category' => t('hyperion'),
  'icon' => 'preview.png',
  'theme' => 'panels_admin_help_page',
  'css' => '../../css/layouts/admin_help_page.layout.css',
  'regions' => array(
    'admin_help_page_body' => t('Body'),
  ),
);
