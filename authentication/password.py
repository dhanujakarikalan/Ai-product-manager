import bcrypt


MAX_PASSWORD_BYTES = 72


def _password_bytes(password: str) -> bytes:

    value = password.encode("utf-8")

    if len(value) > MAX_PASSWORD_BYTES:
        raise ValueError("Password must be 72 bytes or fewer.")

    return value


def hash_password(password: str) -> str:
    """
    Convert plain password into hashed password.
    """
    return bcrypt.hashpw(
        _password_bytes(password),
        bcrypt.gensalt()
    ).decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """
    Compare plain password with hashed password.
    Returns True if they match.
    """
    try:
        return bcrypt.checkpw(
            _password_bytes(plain_password),
            hashed_password.encode("utf-8")
        )
    except (ValueError, TypeError):
        return False