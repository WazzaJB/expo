/*
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

#include "ABI42_0_0ModalHostViewState.h"

namespace ABI42_0_0facebook {
namespace ABI42_0_0React {

#ifdef ANDROID
folly::dynamic ModalHostViewState::getDynamic() const {
  return folly::dynamic::object("screenWidth", screenSize.width)(
      "screenHeight", screenSize.height);
}
#endif

} // namespace ABI42_0_0React
} // namespace ABI42_0_0facebook
