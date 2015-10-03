<?php

/**
 * @file
 * Template overrides as well as (pre-)process and alter hooks for the
 * hyperion theme.
 */

/**
 * Implements hook_preprocess_html().
 */
function hyperion_preprocess_html(&$vars) {
  $theme_path = drupal_get_path('theme', 'hyperion');

  // Not using .info file because it's only possible to set the file weight with
  // hook_css_alter() if both base theme and sub-theme declare their CSS in the
  // same way. adminimal uses hook_preprocess_html(), not .info file.
  drupal_add_css($theme_path . '/css/hyperion.styles.css', array('group' => CSS_THEME, 'media' => 'all', 'weight' => 1));
}

/**
 * Implements hook_preprocess_panels_pane().
 */
function hyperion_preprocess_panels_pane(&$variables) {
  // Add panels-pane--[PANE]--[TYPE]--[SUBTYPE] template suggestion.
  $name = 'panels_pane__' . $variables['pane']->panel . '__' . $variables['pane']->type . '__' . $variables['pane']->subtype;
  $name = str_replace(array(':', '-'), '_', $name);
  $variables['theme_hook_suggestions'][] = $name;
}

/**
 * Implements hook_css_alter().
 */
function hyperion_css_alter(&$css) {
  $base_theme_path = drupal_get_path('theme', 'adminimal');
  $theme_path = drupal_get_path('theme', 'hyperion');

  // Get max weight.
  $max_weight = 0;
  foreach ($css as $key => $value) {
    if (strpos($key, $base_theme_path) === 0) {
      if (strpos($key, $base_theme_path) === 0 && !empty($value['weight']) && $value['weight'] > $max_weight) {
        $max_weight = $value['weight'];
      }
    }
  }

  // Move sub-theme CSS after base theme CSS.
  $order = array();
  foreach ($css as $key => $value) {
    if (strpos($key, $theme_path) === 0) {
      // In reverse order, starting with layouts.
      if (strpos($key, $theme_path . '/layouts') === 0 || strpos($key, $theme_path . '/css/layouts') === 0) {
        $order[1][$key] = $key;
      }
      else {
        $order[0][$key] = $key;
      }
    }
  }
  ksort($order);
  foreach ($order as $values) {
    foreach ($values as $value) {
      $css[$value]['group'] = CSS_THEME;
      $css[$value]['weight'] = ++$max_weight;
    }
  }
}
