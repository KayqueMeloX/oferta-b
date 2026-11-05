/**
 * Google Chrome / Browser Auto-Translate DOM Conflict Patch
 *
 * When browser extensions or Google Chrome auto-translate runs on a page,
 * it replaces text nodes with `<font>` tags. When React tries to re-render
 * or reconcile text nodes, it calls `Node.prototype.removeChild` or
 * `Node.prototype.insertBefore` with nodes whose parent was modified by Google Translate.
 *
 * This throws:
 * "NotFoundError: Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node."
 * or
 * "NotFoundError: Failed to execute 'insertBefore' on 'Node': The node before which the new node is to be inserted is not a child of this node."
 *
 * This patch intercepts these calls safely and prevents React apps from crashing.
 */

if (typeof window !== "undefined" && typeof Node === "function" && Node.prototype) {
  const origRemoveChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function <T extends Node>(child: T): T {
    if (child.parentNode !== this) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Safe DOM intercept (removeChild): prevented crash from browser translation.");
      }
      return child;
    }
    return origRemoveChild.call(this, child) as T;
  };

  const origInsertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function <T extends Node>(newNode: T, referenceNode: Node | null): T {
    if (referenceNode && referenceNode.parentNode !== this) {
      if (typeof console !== "undefined" && console.warn) {
        console.warn("Safe DOM intercept (insertBefore): prevented crash from browser translation.");
      }
      return newNode;
    }
    return origInsertBefore.call(this, newNode, referenceNode) as T;
  };
}

export {};
